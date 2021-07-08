import sortBy from "lodash/sortBy";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import rulesParse from "../../../app/rules-parse";
import formValidation from "../../../app/form-validation";
import TocSections from "../../components/modules/TocSections";
import SectionList from "../../components/modules/SectionList";
import Form from "../../components/modules/Form";
import { Nodes, RouterValues } from "../../../app/types";
import styles from "../../../styles/[version].module.scss";

interface Props {
  nodes: Nodes;
}

export const getStaticProps: getStaticProps = async ({ params }): Promise<void | Nodes> => {
  // Fetch rule set
  try {
    const url = `https://media.wizards.com/${params.year}/downloads/MagicCompRules%${params.version}.txt`;
    const res: string = await fetch(url);
    const rawRuleSetText: string = await res.text();
    // Parse rules text to an array of rule nodes
    const nodes: Nodes = await rulesParse(rawRuleSetText);

    return {
      props: { nodes },
      revalidate: 1,
    };
  } catch (err) {
    // TODO handle error, should lead to a 404 not found
    console.log("getStaticProps error");
    console.error(err);
  }
  return null;
};

export const getStaticPaths: getStaticPaths = async () => {
  const values = [["2021", "2020210419"]];
  const paths = values.map((value) => ({
    params: { year: value[0], version: value[1] },
  }));
  return { paths, fallback: true };
};

const RuleSetPage = (props: Props): JSX.Element => {
  const { nodes } = props;
  const router = useRouter();

  // Get currentUrl for Form
  const routerValues: RouterValues = {
    year: router.query.year,
    version: router.query.version,
  };

  const currentUrl = `https://media.wizards.com/${routerValues.year}/downloads/MagicCompRules%${routerValues.version}.txt`;

  // Form validation Prop. Validate different ruleset
  const validateUrl = async (url: string): Promise<number> => {
    if (!url.length) {
      // If it is an empty string
      return 0;
    }

    const reVersion = /\d{10}/;
    const version: number = reVersion.test(url) ? url.match(reVersion)[0] : 0;
    const reYear = /\d{4}/;
    const year: number = reYear.test(url) ? url.match(reYear)[0] : 0;

    // That ruleset is already displayed
    if (routerValues.version === version && routerValues.year === year) {
      return 3;
    }

    // Offload validation to util fn
    const result = await formValidation(url, version, year);
    // Change the displayed ruleset
    if (result === 200) {
      // Link validated, update router
      router.query.version = version;
      router.query.year = year;
      // Trigger ISR page update
      // TODO: Unknown key error in dev, although update works
      router.push(router);
      return 1;
    }
    // No data found at that link
    return 4;
  };

  // Display a fallback page if waiting to transition to another page
  if (router.isFallback) {
    return (
      <div className={styles.spinnerDiv}>
        <Spinner
          animation="border"
          role="status"
          variant="dark"
          className={styles.spinnerComponent}
        >
          <span className={styles.loadingText}>Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Sort nodes
  const sections = sortBy(
    nodes.filter((node) => node.type === "section"),
    ["sectionNumber"],
  );
  const chapters = sortBy(
    nodes.filter((node) => node.type === "chapter"),
    ["sectionNumber", "chapterNumber"],
  );
  const rules = nodes.filter((node) => node.type === "rule");
  const subrules = nodes.filter((node) => node.type === "subrule");

  // DEBUG values
  console.log(sections);
  console.log(chapters);
  console.log(rules);
  console.log(subrules);

  return (
    <div>
      <div>
        <Form
          validateUrl={validateUrl}
          initialUrl={currentUrl}
          formText="Original Ruleset Link:"
          smallText="Change and submit a link to view a different ruleset."
        />
      </div>
      <div className={styles.views}>
        <div className={styles.tocSections}>
          <TocSections sections={sections} chapters={chapters} />
        </div>
        <div>
          <div className={styles.chapterList}>
            <SectionList
              sections={sections}
              chapters={chapters}
              rules={rules}
              subrules={subrules}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleSetPage;
