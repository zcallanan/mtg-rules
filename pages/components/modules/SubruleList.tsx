import React from "react";
import { useRouter } from "next/router";
import Example from "./Example";
import parseLink from "../../../app/parse-link";
import { Subrule, RouterValues } from "../../../app/types";
import styles from "../../../styles/SubruleList.module.scss";

interface Props {
  subruleSubset: Subrule[];
}

const SubruleList = (props: Props): JSX.Element => {
  const { subruleSubset } = props;

  const router = useRouter();
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
              {subrule.subruleLetter} &nbsp; {parseLink(subrule, routerValues)}
            </li>
          </section>
          <Example subrule={subrule} />
        </div>
      ))}
    </div>
  );
};

export default SubruleList;
