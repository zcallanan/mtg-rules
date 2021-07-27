import { useRouter, NextRouter } from "next/router";
import parseLink from "../utils/parse-link";
import { Rule, Subrule, RouterValues } from "../typing/types";
import styles from "../styles/ExampleText.module.scss";

interface Props {
  rule?: Rule;
  subrule?: Subrule;
  onLinkClick: (chapterNumber: number, dataSource: string) => void;
}

const ExampleText = (props: Props): JSX.Element => {
  const { rule, subrule, onLinkClick } = props;
  const data: Rule | Subrule = rule || subrule;

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
      {data.example.map(
        (example, index) => data.example && (
          <li
            key={rule ? `rule-e${index}` : `subrule-e${index}`}
            className={`${styles.example} list-group-item`}
          >
            {parseLink(
              (rule)
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
                },
            )}
          </li>
        ),
      )}
    </div>
  );
};

export default ExampleText;
