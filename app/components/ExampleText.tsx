import { useRouter, NextRouter } from "next/router";
import parseLink from "../utils/parse-link";
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
      {exampleText.map(
        (example, index) =>
          data.example && (
            <li
              key={rule ? `rule-e${index}` : `subrule-e${index}`}
              className={`${styles.example} list-group-item`}
            >
              {!searchResults.searchTerm
                ? parseLink(
                    rule
                      ? {
                          routerValues,
                          onLinkClick,
                          example,
                          rule,
                          searchResults,
                          allChaptersN,
                        }
                      : {
                          routerValues,
                          onLinkClick,
                          example,
                          subrule,
                          searchResults,
                          allChaptersN,
                        }
                  )
                : modifySearchRules(
                    rule
                      ? {
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
                        }
                      : {
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
                        }
                  )}
            </li>
          )
      )}
    </div>
  );
};

export default ExampleText;
