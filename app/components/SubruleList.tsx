import { useRouter, NextRouter } from "next/router";
import Example from "./Example";
import parseLink from "../utils/parse-link";
import { Subrule, RouterValues } from "../typing/types";
import styles from "../styles/SubruleList.module.scss";

interface Props {
  subruleSubset: Subrule[];
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
}

const SubruleList = (props: Props): JSX.Element => {
  const { subruleSubset, onLinkClick } = props;

  const router: NextRouter = useRouter();
  const year: string = (Array.isArray(router.query.year))
    ? router.query.year[0]
    : router.query.year;
  const version: string = (Array.isArray(router.query.version))
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
              {subrule.subruleLetter} &nbsp; {parseLink({ routerValues, onLinkClick, subrule })}
            </li>
          </section>
          <Example subrule={subrule} onLinkClick={onLinkClick}/>
        </div>
      ))}
    </div>
  );
};

export default SubruleList;
