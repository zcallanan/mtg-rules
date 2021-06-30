import { useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useRouter } from 'next/router';
import Spinner from 'react-bootstrap/Spinner';
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
  const router = useRouter();

  // Search form validation prop
  const validateUrl = (url: string): number => {
    const version = url.match(/%(\d{10})[.]/)[1];
    const year = url.match(/\/(\d{4})\//)[1];

    // If valid, take success actions

    // DEBUG
    // router.query.version = '2020190823';
    // router.query.year = '2019';

    router.query.version = version;
    router.query.year = year;
    router.push(router);
    return 1;
  };



  // Get currentUrl for Form
  const currentYear = router.query.year;
  console.log(currentYear)
  const currentVersion = router.query.version;
  const currentUrl = `https://media.wizards.com/${currentYear}/downloads/MagicCompRules%${currentVersion}.txt`;

  // Fallback
  if (router.isFallback) {
    return (
      <div className={styles.spinnerDiv}>
        <Spinner
          animation='border'
          role='status'
          variant='dark'
          className={styles.spinnerComponent}
        >
          <span className={styles.loadingText}>Loading...</span>
        </Spinner>
      </div>
    )
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
    <div>
       <div>
          <Form
            validateUrl={validateUrl}
            initialUrl={currentUrl}
            formText='Original Ruleset Link:'
            smallText='Enter and submit a different link to view the rules from another ruleset.'
          />
        </div>
        <div className={styles.views}>
          <div className={styles.tocSections} >
            <TocSections sections={sections} chapters={chapters} />
          </div>
          <div>
            <div className={styles.chapterList}>
              <ChapterList chapters={chapters} rules={rules} subrules={subrules} />
            </div>
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
