import { useRouter, NextRouter } from "next/router";
import ExampleText from "./ExampleText";
import parseLink from "../utils/parse-link";
import modifySearchRules from "../utils/modify-search-rules";
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
        <div key={`dv${index}`}>
          <section
            id={`${subrule.chapterNumber}.${subrule.ruleNumber}${subrule.subruleLetter}`}
          >
            <li
              key={`subr-${index}`}
              className={`${styles.subruleText} list-group-item`}
            >
              {subrule.chapterNumber}.{subrule.ruleNumber}
              {subrule.subruleLetter} &nbsp;
              {!searchResults.searchTerm
                ? parseLink({
                    routerValues,
                    onLinkClick,
                    subrule,
                    searchResults,
                    allChaptersN,
                  })
                : modifySearchRules({
                    searchResults,
                    subrule,
                    toModify: parseLink({
                      routerValues,
                      onLinkClick,
                      subrule,
                      searchResults,
                      allChaptersN,
                    }),
                  })}
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

export default SubruleList;
