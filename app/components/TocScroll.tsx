import {
  Dispatch,
  SetStateAction,
  MutableRefObject,
  useEffect,
  useState,
} from "react";
import { Chapter } from "../typing/types";

interface Props {
  scrollToc: number;
  setScrollToc: Dispatch<SetStateAction<number>>;
  tocRefs: MutableRefObject<HTMLDivElement[]>;
  chaptersInUse: Chapter[];
}

const TocScroll = (props: Props): JSX.Element => {
  const { scrollToc, setScrollToc, tocRefs, chaptersInUse } = props;

  const [localChapters, setLocalChapters] = useState<Chapter[]>(null);

  // Save to local state to ensure updated tocRefs is evaluated
  useEffect(() => {
    if (localChapters !== chaptersInUse) {
      setLocalChapters(chaptersInUse);
    }
  }, [chaptersInUse, localChapters]);

  // Scroll to scrollToc chapter number
  useEffect(() => {
    if (scrollToc % 100 !== 0) {
      const re = new RegExp(`(${scrollToc - 1})`);
      const element = tocRefs.current.find((elem) => re.test(elem.innerText));
      element.scrollIntoView();
    }
  }, [scrollToc, tocRefs]);

  // Scrolling complete, set scrollToc to evaluate false
  useEffect(() => {
    if (scrollToc) {
      setScrollToc(0);
    }
  }, [scrollToc, setScrollToc]);

  return null;
};

export default TocScroll;
