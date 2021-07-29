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
}

const ExampleText = (props: Props): JSX.Element => {
  const { rule, subrule, onLinkClick, searchResults } = props;
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
                        }
                      : {
                          routerValues,
                          onLinkClick,
                          example,
                          subrule,
                        }
                  )
                : modifySearchRules(
                    rule
                      ? {
                          searchTerm: searchResults.searchTerm,
                          rule,
                          toModify: parseLink({
                            routerValues,
                            onLinkClick,
                            example,
                            rule,
                          }),
                        }
                      : {
                          searchTerm: searchResults.searchTerm,
                          subrule,
                          toModify: parseLink({
                            routerValues,
                            onLinkClick,
                            example,
                            subrule,
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
