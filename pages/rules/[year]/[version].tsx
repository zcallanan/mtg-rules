import React, { useState, useCallback, useRef, useEffect } from "react";
import sortBy from "lodash/sortBy";
import { useRouter } from "next/router";
import { Spinner, Tabs, Tab } from "react-bootstrap";
import rulesParse from "../../../app/rules-parse";
import useTopRule from "../../components/modules/useTopRule";
import TocSections from "../../components/modules/TocSections";
import SectionList from "../../components/modules/SectionList";
import ChapterTitle from "../../components/modules/ChapterTitle";
import RulesetForm from "../../components/modules/RulesetForm";
import SearchForm from "../../components/modules/SearchForm";
import { Nodes } from "../../../app/types";
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

  // Determine Rulelist chapter title from ToC anchor or scrolling
  const [refArray, setRefArray] = useState([]);
  const [throttle, setThrottle] = useState(false);
  const [chapterValues, setChapterValues] = useState({
    chapterNumber: 100,
  });

  // SectionList viewport ref
  const rootRef = useRef<HTMLDivElement>();

  // SectionList rootRef.current, observed element
  const root: RefObject<HTMLDivElement> = rootRef.current || null;

  // Rule div ref
  const ref = useRef<HTMLDivElement>();

  // Callback to collect an array of rule div refs to observe
  const setRefs = useCallback(
    (node) => {
      ref.current = node;
      if (node && !refArray.includes(node)) {
        setRefArray((oldArray) => [...oldArray, node]);
      }
    },
    [refArray],
  );

  /*
    When a toc link is clicked, chapterTitle returns a chapterNumber via a prop.
    This value is overriden by the callback on render, unless the update is
    throttled, callback chapterNumber saved to state, and a condition prevents the
    callback chapterNumber from being saved by setTitle.
  */

  // Apply throttle
  useEffect(() => {
    if (throttle) {
      setTimeout(() => {
        setThrottle(!throttle);
      }, 1500);
    }
  }, [throttle]);

  // Save the initial url hash value to state
  useEffect(() => {
    // Get the url hash value
    const anchorValue = router.asPath.split("#");
    // Set the initial hash value
    setChapterValues((prevValues) => ({
      ...prevValues,
      init: Number(anchorValue[1]),
    }));
  // Eslint complains, but this should only be done once at init, so [] included
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Callback that observes rule divs for intersection with the top of viewport
  const chapterNumber = useTopRule(refArray, root) || chapterValues.init;

  // Save chapter number to state, used by ChapterTitle chapter attr
  const updateTitle = (chapterN): void => {
    if (!throttle && chapterValues.chapterNumber !== chapterN) {
      setChapterValues((prevValues) => ({
        ...prevValues,
        chapterNumber: chapterN,
      }));
      setThrottle(true);
    }
  };

  // ToC chapter title click prop
  const tocOnClick = (chapterN: number): number => {
    updateTitle(chapterN);
  };

  let callbackNumber: number;

  if (!throttle && chapterNumber) {
    callbackNumber = chapterNumber;
  }

  // Update title with callback return if it was not returned while throttled
  if (callbackNumber && callbackNumber !== chapterValues.chapterNumber) {
    updateTitle(callbackNumber);
  }

  // TODO: Shallow routing a hash forces a new render?
  // // Update url hash with chapterNumber
  // useEffect(() => {
  //   if (callbackNumber && callbackNumber !== chapterValues.chapterNumber) {
  //     const anchorValue = router.asPath.split("#");
  //     const newPath = `${anchorValue[0]}#${callbackNumber}`;

  //     // If it is a new path, then update url
  //     if (newPath !== router.asPath) {
  //       router.push(`#${callbackNumber}`, undefined, { shallow: true });
  //     }
  //   }
  // }, [router, callbackNumber, chapterValues.chapterNumber]);

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
  // console.log(sections);
  // console.log(chapters);
  // console.log(rules);
  // console.log(subrules);

  return (
    <div>
      <div className={styles.bodyContainer}>
        <div className={styles.leftContainer}>
          <TocSections sections={sections} chapters={chapters} tocOnClick={tocOnClick}/>
        </div>
        <div className={styles.rightContainer}>
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
                    smallText="Change and submit a link to view a different ruleset."
                  />
                </Tab>
              </Tabs>
            </div>
            <div className={styles.chapterTitleContainer}>
              <ChapterTitle chapter={chapters
                .find((chapter) => chapter
                  .chapterNumber === chapterValues.chapterNumber)} toc={0} />
            </div>
            <div className={styles.rulesContainer}>
              <SectionList
                sections={sections}
                chapters={chapters}
                rules={rules}
                subrules={subrules}
                elRef={setRefs}
                root={rootRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleSetPage;
