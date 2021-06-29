import React from 'react';
import { RuleI, SubruleI } from '../../../app/types.ts';
import styles from '../../../styles/SubruleList.module.scss';

interface Props {
  rule: RuleI;
  subruleSubset: Subrule[];
}

const SubruleList = (props: Props): JSX.Element => {
  const { rule, subruleSubset } = props;
  let key: string;
  let i = 0;

  // Create an array of subrules for the rule
  const subruleArray: string[] = subruleSubset.map((subrule) => {
    // If the subrule belongs to the rule
    if (subrule.ruleNumber === rule.ruleNumber) {
      i += 1;
      const key: string = `sr${subrule.ruleNumber}${subrule.subruleLetter}-${i}`;

      // Create elements for example text
      let exampleList = [];
      if (subrule.example) {
        exampleList = subrule.example.map((example) => {
          i += 1;
          return (
            <li key={`e${i}`} className={styles.example} className='list-group-item'>
              {example}
            </li>
          )
        })
      }

      // Return the subrule values for the rule
      return (
        [
          <li key={key} className={styles.subruleText} className={'list-group-item'}>
            {subrule.chapterNumber}.{subrule.ruleNumber}{subrule.subruleLetter} &nbsp; {subrule.text}
          </li>,
          exampleList
        ]
      )
    }
  })
  return (
    <div>
      {subruleArray}
    </div>
  )
};

export default SubruleList;
