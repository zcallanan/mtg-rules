import { Dispatch, SetStateAction, MutableRefObject } from "react";
import useScrollToc from "../hooks/useScrollToc";

interface Props {
  scrollToc: number;
  setScrollToc: Dispatch<SetStateAction<number>>;
  tocRefs: MutableRefObject<HTMLDivElement[]>;
}

const ScrollTocWrapper = (props: Props): JSX.Element => {
  const { scrollToc, setScrollToc, tocRefs } = props;

  // Scroll to scrollToc chapter number
  const result = useScrollToc({ scrollToc, tocRefs });

  // Scrolling complete, set scrollToc to evaluate false
  if (scrollToc && result) {
    setScrollToc(0);
  }

  return null;
};

export default ScrollTocWrapper;
