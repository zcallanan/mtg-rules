import { useRouter, NextRouter } from "next/router";
import ExampleText from "./ExampleText";
import parseLink from "../utils/parse-link";
import modifySearchRules from "../utils/modify-search-rules";
import { Subrule, RouterValues } from "../typing/types";
import styles from "../styles/SubruleList.module.scss";

interface Props {
  subruleSubset: Subrule[];
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
  searchTerm: string;
}

const SubruleList = (props: Props): JSX.Element => {
  const { subruleSubset, onLinkClick, searchTerm } = props;

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
              {!searchTerm
                ? parseLink({ routerValues, onLinkClick, subrule })
                : modifySearchRules({
                    searchTerm,
                    subrule,
                    toModify: parseLink({ routerValues, onLinkClick, subrule }),
                  })}
            </li>
          </section>
          <ExampleText
            subrule={subrule}
            onLinkClick={onLinkClick}
            searchTerm={searchTerm}
          />
        </div>
      ))}
    </div>
  );
};

export default SubruleList;
