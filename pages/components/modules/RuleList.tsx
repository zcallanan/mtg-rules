import React from 'react';
import SubruleList from './SubruleList.tsx';
import { ChapterI, RuleI, SubruleI } from '../../../app/types.ts';
import styles from '../../../styles/RuleList.module.scss';

interface Props {
  chapter: ChapterI;
  ruleSubset: RuleI[];
  subrules: Subrule[];
}

const RuleList = (props: Props): JSX.Element => {
  const { chapter, ruleSubset, subrules } = props;

  const ruleArray: string[] = ruleSubset.map((rule) => {
      const subruleSubset = subrules.filter((subrule) => {
        return (
          rule.ruleNumber === subrule.ruleNumber
          && rule.chapterNumber === subrule.chapterNumber
        )
      });

      let i = 0;
      const key: string = `r${rule.ruleNumber}`;
      const ulKey: string = `r-u${chapter.chapterNumber}`;

      // Create elements for example text
      let exampleList = [];
      if (rule.example) {
        exampleList = rule.example.map((example) => {
          i += 1;
          return (
            <li key={`e${i}`} className={styles.example} className='list-group-item'>
              {example}
            </li>
          )
        })
      }

      if (subruleSubset) {
        // Display rule values for the chapter & prep displaying a subrule list
        return (
          [
            <li key={key} className={styles.ruleText} className='list-group-item'>
              {rule.chapterNumber}.{rule.ruleNumber} &nbsp; {rule.text}
            </li>,
            exampleList,
            <ul key={ulKey} className='list-group'>
              <SubruleList rule={rule} subruleSubset={subruleSubset}/>
            </ul>
          ]
        )
      } else {
        // Omit ul for rules with no subrules
        [
          <li key={key} className={styles.ruleText} className='list-group-item'>
            {rule.chapterNumber}.{rule.ruleNumber} &nbsp; {rule.text}
          </li>,
        ]
      }

  })
  return (
    <div>
      {ruleArray}
    </div>
  )
};

export default RuleList;
