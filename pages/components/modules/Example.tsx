import { useRouter, NextRouter } from "next/router";
import parseLink from "../../../app/parse-link";
import { Rule, Subrule, RouterValues } from "../../../app/types";
import styles from "../../../styles/Example.module.scss";

interface Props {
  rule?: Rule;
  subrule?: Subrule;
  onLinkClick: (chapterNumber: number) => number;
}

const Example = (props: Props): JSX.Element => {
  const { rule, subrule, onLinkClick } = props;
  const data: Rule | Subrule = rule || subrule;

  const router: NextRouter = useRouter();
  const routerValues: RouterValues = {
    year: router.query.year,
    version: router.query.version,
  };

  return (
    <div>
      {data.example.map(
        (example, index) => data.example && (
          <li
            key={rule ? `rule-e${index}` : `subrule-e${index}`}
            className={`${styles.example} list-group-item`}
          >
            {parseLink(data, routerValues, onLinkClick, example)}
          </li>
        ),
      )}
    </div>
  );
};

export default Example;
