import { memo } from "react";
import { useRouter, NextRouter } from "next/router";
import ExampleText from "./ExampleText";
import replaceText from "../utils/replace-text";
import { Subrule, RouterValues, SearchResults } from "../typing/types";
import styles from "../styles/SubruleList.module.scss";

interface Props {
  subruleSubset: Subrule[];
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchResults: SearchResults;
  allChaptersN: string[];
}

const SubruleList = (props: Props): JSX.Element => {
  const { subruleSubset, onLinkClick, searchResults, allChaptersN } = props;

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
      {subruleSubset.map((subrule, index) => (
        <div key={`subruleContainer-${index}`}>
          <section
            id={`${subrule.chapterNumber}.${subrule.ruleNumber}${subrule.subruleLetter}`}
          >
            <li
              key={`subruleListItem-${index}`}
              className={`${styles.subruleListItem} list-group-item`}
            >
              <div className={styles.subruleInnerContainer}>
                <span>
                  <strong>
                    {subrule.chapterNumber}.{subrule.ruleNumber}
                    {subrule.subruleLetter}
                  </strong>
                </span>
                <span>{" • "}</span>
                <span>
                  {replaceText({
                    allChaptersN,
                    onLinkClick,
                    routerValues,
                    subrule,
                    searchResults,
                  })}
                </span>
              </div>
            </li>
          </section>
          <ExampleText
            subrule={subrule}
            onLinkClick={onLinkClick}
            searchResults={searchResults}
            allChaptersN={allChaptersN}
          />
        </div>
      ))}
    </div>
  );
};

export default memo(SubruleList);
