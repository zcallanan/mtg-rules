import { useRouter, NextRouter } from "next/router";
import Example from "./Example";
import parseLink from "../../../app/parse-link";
import { Subrule, RouterValues } from "../../../app/types";
import styles from "../../../styles/SubruleList.module.scss";

interface Props {
  subruleSubset: Subrule[];
  onLinkClick: (chapterNumber: number) => number;
}

const SubruleList = (props: Props): JSX.Element => {
  const { subruleSubset, onLinkClick } = props;

  const router: NextRouter = useRouter();
  const routerValues: RouterValues = {
    year: router.query.year,
    version: router.query.version,
  };

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
              {subrule.subruleLetter} &nbsp; {parseLink(
                subrule,
                routerValues,
                onLinkClick,
              )}
            </li>
          </section>
          <Example subrule={subrule} onLinkClick={onLinkClick}/>
        </div>
      ))}
    </div>
  );
};

export default SubruleList;
