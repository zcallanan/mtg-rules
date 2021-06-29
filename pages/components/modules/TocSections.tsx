import React from 'react';
import TocChapters from './TocChapters.tsx';
import { SectionI, ChapterI } from '../../../app/types.ts';
import styles from '../../../styles/TocSections.module.scss';

interface Props {
  sections: SectionI[];
  chapters: ChapterI[];
}

const TocSections = (props: Props): JSX.Element => {
  const { sections, chapters } = props;
  let key: string;

  const sectionArray: string[] = sections.map((section) => {
    const key: string = `s${section.sectionNumber}`;
    const divKey: string = `s-d${section.sectionNumber}`

    // Return section values and prep displaying a list of chapters
    return (
      [
        <span key={key} className={styles.sectionText}>
          {section.sectionNumber}. &nbsp; {section.text}
        </span>,
        <div key={divKey} className={styles.tocChapters}>
          <TocChapters sectionNumber={section.sectionNumber} chapters={chapters}/>
        </div>
      ]
    )
  })

  return (
    <div>
      {sectionArray}
    </div>
  )
};

export default TocSections;
