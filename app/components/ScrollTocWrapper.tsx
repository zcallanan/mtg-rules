import {
  Dispatch,
  SetStateAction,
  MutableRefObject,
  useEffect,
  useState,
} from "react";
import useScrollToc from "../hooks/useScrollToc";
import { Chapter } from "../typing/types";

interface Props {
  scrollToc: number;
  setScrollToc: Dispatch<SetStateAction<number>>;
  tocRefs: MutableRefObject<HTMLDivElement[]>;
  chaptersInUse: Chapter[];
}

const ScrollTocWrapper = (props: Props): JSX.Element => {
  const { scrollToc, setScrollToc, tocRefs, chaptersInUse } = props;

  const [localChapters, setLocalChapters] = useState<Chapter[]>(null);

  // Save to local state to ensure updated tocRefs is evaluated
  useEffect(() => {
    if (localChapters !== chaptersInUse) {
      setLocalChapters(chaptersInUse);
    }
  }, [chaptersInUse, localChapters]);

  // Scroll to scrollToc chapter number
  const result = useScrollToc({ scrollToc, tocRefs });

  // Scrolling complete, set scrollToc to evaluate false
  if (scrollToc && result) {
    setScrollToc(0);
  }

  return null;
};

export default ScrollTocWrapper;
