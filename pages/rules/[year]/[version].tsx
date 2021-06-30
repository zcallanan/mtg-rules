import { useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useRouter } from 'next/router';
import rulesParse from '../../../app/rules-parse.ts';
import TocSections from '../../components/modules/TocSections.tsx';
import ChapterList from '../../components/modules/ChapterList.tsx';
import Form from '../../components/modules/Form.tsx';
import { NodesI } from '../../../app/types.ts';
import styles from '../../../styles/[version].module.scss';

interface Props {
  nodes: NodesI;
}

const RuleSetPage = (props: Props): JSX.Element => {
  const { nodes } = props;

  // Search form validation prop
  const validateUrl = (url: string): number => {
    const version = url.match(/%(\d{10})[.]/)[1];
    const year = url.match(/\/(\d{4})\//)[1];

    // If valid, take success actions
    // TODO This doesn't work
    // getStaticProps({params: { year, version }});
    return 1;
  };

  const router = useRouter();

  // Get currentUrl for Form
  const currentYear = router.query.year;
  console.log(currentYear)
  const currentVersion = router.query.version;
  const currentUrl = `https://media.wizards.com/${currentYear}/downloads/MagicCompRules%${currentVersion}.txt`;

  // Fallback
  if (router.isFallback) {
    return <div>Loading...</div> // TODO Replace this
  }

  // Sort nodes
  const sections = sortBy(
    nodes.filter((node) => node.type === 'section'),
    ['sectionNumber'],
  );
  const chapters = sortBy(
    nodes.filter((node) => node.type === 'chapter'),
    ['sectionNumber', 'chapterNumber'],
  );
  const rules = nodes.filter((node) => node.type === 'rule');
  const subrules = nodes.filter((node) => node.type === 'subrule');

  //DEBUG values
  console.log(sections)
  console.log(chapters)
  console.log(rules)
  console.log(subrules)

  return (
    <div className={styles.views}>
      <div className={styles.tocSections} >
        <TocSections sections={sections} chapters={chapters} />
      </div>
      <div>
        <div>
          <Form validateUrl={validateUrl} initialUrl={currentUrl}/>
        </div>
        <div className={styles.chapterList}>
          <ChapterList chapters={chapters} rules={rules} subrules={subrules} />
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: getStaticProps = async ({ params }) => {
  // Fetch rule set
  try {
    const url = `https://media.wizards.com/${params.year}/downloads/MagicCompRules%${params.version}.txt`
    const res: string = await fetch(url);
    const rawRuleSetText = await res.text();
    // Parse rules text to an array of rule nodes
    const nodes = await rulesParse(rawRuleSetText);

    return {
      props: { nodes },
      revalidate: 1,
    }
  } catch (err) {
    // TODO handle error
    console.error(err);
  }
}

export const getStaticPaths: getStaticPaths = async () => {
  const values = [['2021', '2020210419']];
  const paths = values.map((value) => ({ params: { year: value[0], version: value[1] } }));
  return { paths, fallback: true };
}

export default RuleSetPage;
