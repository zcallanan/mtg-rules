import { MutableRefObject } from "react";
import { useRouter, NextRouter } from "next/router";
import SubruleGroup from "./SubruleGroup";
import ExampleText from "./ExampleText";
import parseLink from "../utils/parse-link";
import modifySearchRules from "../utils/modify-search-rules";
import { Rule, Subrule, RouterValues, SearchResults } from "../typing/types";
import styles from "../styles/RuleList.module.scss";

interface Props {
  ruleSubset: Rule[];
  rules: Rule[];
  subrules: Subrule[];
  elRef: MutableRefObject<HTMLDivElement[]>;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchResults: SearchResults;
  allChaptersN: string[];
}

const RuleList = (props: Props): JSX.Element => {
  const {
    ruleSubset,
    rules,
    subrules,
    elRef,
    onLinkClick,
    searchResults,
    allChaptersN,
  } = props;

  const router: NextRouter = useRouter();
  const year: string = Array.isArray(router.query.year)
    ? router.query.year[0]
    : router.query.year;
  const version: string = Array.isArray(router.query.version)
    ? router.query.version[0]
    : router.query.version;
  const routerValues: RouterValues = { year, version };

  return (
    <div>
      {ruleSubset.map((rule, index) => (
        <div
          key={`ruleListDiv-${index}`}
          className={styles.ruleDiv}
          // eslint-disable-next-line no-return-assign
          ref={(el) =>
            (elRef.current[
              rules.findIndex(
                (r) =>
                  r.ruleNumber === rule.ruleNumber &&
                  r.chapterNumber === rule.chapterNumber
              )
            ] = el)
          }
        >
          <section id={`${rule.chapterNumber}.${rule.ruleNumber}`}>
            <li
              key={`r${rule.ruleNumber}`}
              className={`${styles.ruleText} list-group-item`}
            >
              {rule.chapterNumber}.{rule.ruleNumber} &nbsp;
              {!searchResults.searchTerm
                ? parseLink({
                    routerValues,
                    onLinkClick,
                    rule,
                    searchResults,
                    allChaptersN,
                  })
                : modifySearchRules({
                    searchTerm: searchResults.searchTerm,
                    rule,
                    toModify: parseLink({
                      routerValues,
                      onLinkClick,
                      rule,
                      searchResults,
                      allChaptersN,
                    }),
                  })}
            </li>
          </section>
          <ExampleText
            rule={rule}
            onLinkClick={onLinkClick}
            searchResults={searchResults}
            allChaptersN={allChaptersN}
          />
          <SubruleGroup
            rule={rule}
            subrules={subrules}
            onLinkClick={onLinkClick}
            searchResults={searchResults}
            allChaptersN={allChaptersN}
          />
        </div>
      ))}
    </div>
  );
};

export default RuleList;
