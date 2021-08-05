import { useRef, useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import parseLink from "../utils/parse-link";
import modifyExampleText from "../utils/modify-example-text";
import modifySearchRules from "../utils/modify-search-rules";
import { Rule, Subrule, RouterValues, SearchResults } from "../typing/types";
import styles from "../styles/ExampleText.module.scss";

interface Props {
  rule?: Rule;
  subrule?: Subrule;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchResults: SearchResults;
  allChaptersN: string[];
}

const ExampleText = (props: Props): JSX.Element => {
  const { rule, subrule, onLinkClick, searchResults, allChaptersN } = props;
  const data: Rule | Subrule = rule || subrule;
  // Use regular array of example strings if no searchTerm
  const exampleText =
    searchResults && !searchResults.searchTerm
      ? data.example
      : data.exampleSearch;

  // RouterValues
  const router: NextRouter = useRouter();
  const year: string = Array.isArray(router.query.year)
    ? router.query.year[0]
    : router.query.year;
  const version: string = Array.isArray(router.query.version)
    ? router.query.version[0]
    : router.query.version;
  const routerValues: RouterValues = { year, version };

  // Container div refs
  const outerContainerDiv = useRef<HTMLDivElement>();
  const innerContainerDiv = useRef<HTMLDivElement[]>([]);

  // Insert different styling classes for rule or subrule
  useEffect(() => {
    if (
      rule &&
      exampleText.length &&
      outerContainerDiv.current &&
      innerContainerDiv.current.length
    ) {
      outerContainerDiv.current.classList.add(styles.ruleExampleContainer);
      innerContainerDiv.current.forEach((d) => {
        if (d) {
          d.classList.add(styles.ruleExInnerContainer);
        }
      });
    } else if (
      subrule &&
      exampleText.length &&
      outerContainerDiv.current &&
      innerContainerDiv.current.length
    ) {
      outerContainerDiv.current.classList.add(styles.subruleExampleContainer);
      innerContainerDiv.current.forEach((d) => {
        if (d) {
          d.classList.add(styles.subruleExInnerContainer);
        }
      });
    }
  }, [exampleText.length, rule, subrule]);

  return (
    <div ref={outerContainerDiv}>
      {exampleText.map(
        (example, index) =>
          data.example && (
            <li
              key={rule ? `rule-e${index}` : `subrule-e${index}`}
              className={`${
                rule ? styles.exampleRuleItem : styles.exampleSubruleItem
              } list-group-item`}
            >
              {/* eslint-disable-next-line no-return-assign */}
              <div ref={(el) => (innerContainerDiv.current[index] = el)}>
                <span>
                  <em>
                    {rule
                      ? `${rule.chapterNumber}.${rule.ruleNumber} `
                      : `${subrule.chapterNumber}.${subrule.ruleNumber}${subrule.subruleLetter} `}
                  </em>
                </span>
                <span>
                  {!searchResults.searchTerm
                    ? modifyExampleText(
                        rule
                          ? {
                              rule,
                              exampleText: parseLink({
                                routerValues,
                                onLinkClick,
                                example,
                                rule,
                                searchResults,
                                allChaptersN,
                              }),
                            }
                          : {
                              subrule,
                              exampleText: parseLink({
                                routerValues,
                                onLinkClick,
                                example,
                                subrule,
                                searchResults,
                                allChaptersN,
                              }),
                            }
                      )
                    : modifyExampleText(
                        rule
                          ? {
                              rule,
                              exampleText: modifySearchRules({
                                searchResults,
                                rule,
                                toModify: parseLink({
                                  routerValues,
                                  onLinkClick,
                                  example,
                                  rule,
                                  searchResults,
                                  allChaptersN,
                                }),
                              }),
                            }
                          : {
                              subrule,
                              exampleText: modifySearchRules({
                                searchResults,
                                subrule,
                                toModify: parseLink({
                                  routerValues,
                                  onLinkClick,
                                  example,
                                  subrule,
                                  searchResults,
                                  allChaptersN,
                                }),
                              }),
                            }
                      )}
                </span>
              </div>
            </li>
          )
      )}
    </div>
  );
};

export default ExampleText;
