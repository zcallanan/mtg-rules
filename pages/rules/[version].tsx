import sortBy from 'lodash/sortBy';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import rulesParse from '../../app/rules-parse.ts';
import TocSections from '../components/modules/TocSections.tsx';
import ChapterList from '../components/modules/ChapterList.tsx';
import styles from '../../styles/[version].module.scss';

const RuleSetPage = (nodes) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const sections = sortBy(
    nodes.nodes.filter((node) => node.type === 'section'),
    ['sectionNumber'],
  );
  const chapters = sortBy(
    nodes.nodes.filter((node) => node.type === 'chapter'),
    ['sectionNumber', 'chapterNumber'],
  );
  const rules = nodes.nodes.filter((node) => node.type === 'rule');

  const subrules = nodes.nodes.filter((node) => node.type === 'subrule');

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
      <div className={styles.chapterList}>
        <ChapterList chapters={chapters} rules={rules} subrules={subrules} />
      </div>
    </div>
  )
}

export const getStaticProps: getStaticProps = async ({ params }) => {
  // Fetch rule set
  const url = `https://media.wizards.com/2021/downloads/MagicCompRules%${params.version}.txt`
  const res: string = await fetch(url);
  const rawRuleSetText = await res.text();

  // Parse rules text to an array of rule nodes
  const nodes = await rulesParse(rawRuleSetText);

  return {
    props: { nodes },
    revalidate: 1,
  }
}

export const getStaticPaths = async () => {
  const versions = ['2020210419'];
  const paths = versions.map((version) => ({ params: { version } }));
  return { paths, fallback: true };
}

export default RuleSetPage;
