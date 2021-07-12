import React, { useState, useCallback, useRef, useEffect } from "react";
import sortBy from "lodash/sortBy";
import { useRouter } from "next/router";
import { Spinner, Tabs, Tab } from "react-bootstrap";
import rulesParse from "../../../app/rules-parse";
import TocSections from "../../components/modules/TocSections";
import SectionList from "../../components/modules/SectionList";
import ChapterTitle from "../../components/modules/ChapterTitle";
import RulesetForm from "../../components/modules/RulesetForm";
import SearchForm from "../../components/modules/SearchForm";
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
  const [titleNumber, setTitle] = useState(100); // temp
  const [refArray, setRefArray] = useState([]);

  // RuleList viewport ref
  const root = useRef();

  // Rule div ref
  const ref = useRef();

  // Ref to store intersection observer across renders
  const observer = useRef();

  // Callback to collect an array of rule div refs
  const setRefs = useCallback(
    (node) => {
      ref.current = node;
      if (node) {
        setRefArray((oldArray) => [...oldArray, node]);
      }
    },
    [],
  );

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        // console.log(entry)
        // console.log(entry.target.outerHTML.match(/(\d{3})/g)[0]);
        if (entry.isIntersecting) {
          console.log("test", entry)
        }
        if (entry && entry.intersectionRect.top === entry.rootBounds.top) {
          console.log(entry.target.outerHTML.match(/(\d{3})/g)[0]);
          console.log(entry)
          // if (entry.target.nextSibling) {
          //   console.log(entry)
          //   console.log(entry.target.nextSibling.outerHTML.match(/(\d{3})/g)[0])
          // }
        }
      },
      {
        root,
        rootMargin: "0px, 0px, -100%, 0px",
      }),
    );
    const { current: currentObserver } = observer;

    if (refArray.length) {
      refArray.forEach((r) => {
        currentObserver.observe(r);
      });
    }

    return () => currentObserver.disconnect();
  }, [refArray]);

  // Get currentUrl for Form
  const routerValues: RouterValues = {
    year: router.query.year,
    version: router.query.version,
  };
  const currentUrl = `https://media.wizards.com/${routerValues.year}/downloads/MagicCompRules%${routerValues.version}.txt`;

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
      <div className={styles.bodyContainer}>
        <div className={styles.leftContainer}>
          <TocSections sections={sections} chapters={chapters} />
        </div>
        <div className={styles.rightContainer} ref={root}>
          <div className={styles.rightRelative}>
            <div className={styles.tabsContainer}>
              <Tabs defaultActiveKey="search">
                <Tab eventKey="search" title="Search Ruleset">
                  <div>
                    <SearchForm />
                  </div>
                </Tab>
                <Tab eventKey="ruleset" title="Load Another Ruleset">
                  <RulesetForm
                    initialUrl={currentUrl}
                    smallText="Change and submit a link to view a different ruleset."
                  />
                </Tab>
              </Tabs>
            </div>
            <div className={styles.chapterTitleContainer}>
              <ChapterTitle chapter={chapters
                .find((chapter) => chapter.chapterNumber === titleNumber)} toc={0} />
            </div>
            <div className={styles.rulesContainer}>
              <SectionList
                sections={sections}
                chapters={chapters}
                rules={rules}
                subrules={subrules}
                elRef={setRefs}
                // root={root}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleSetPage;
