import {
  Dispatch,
  SetStateAction,
  MutableRefObject,
  useEffect,
  useState,
  memo,
} from "react";
import { Chapter, TocScrollData } from "../typing/types";

interface Props {
  scrollToc: number;
  setScrollToc: Dispatch<SetStateAction<number>>;
  tocRefs: MutableRefObject<HTMLDivElement[]>;
  chaptersInUse: Chapter[];
}

const TocScroll = (props: Props): JSX.Element => {
  const { scrollToc, setScrollToc, tocRefs, chaptersInUse } = props;

  const [tocScrollData, setTocScrollData] = useState<TocScrollData>({
    chaptersInUse: [],
    tocDivs: [],
  });
  const [scrolled, setScrolled] = useState<number>(0);

  // Save to local state
  useEffect(() => {
    if (
      tocScrollData.chaptersInUse !== chaptersInUse ||
      tocScrollData.tocDivs !== tocRefs.current
    ) {
      setTocScrollData({
        chaptersInUse,
        tocDivs: tocRefs.current,
      });
    }
  }, [
    chaptersInUse,
    tocRefs,
    tocScrollData.chaptersInUse,
    tocScrollData.tocDivs,
  ]);

  // Scroll to scrollToc chapter number
  useEffect(() => {
    if (
      !tocScrollData.tocDivs.includes(null) &&
      tocScrollData.chaptersInUse &&
      tocScrollData.chaptersInUse.length
    ) {
      // Create regex to find the element
      const re = new RegExp(`(${scrollToc})`);

      // Find the element to scroll to
      const element = tocScrollData.tocDivs.find((elem) =>
        re.test(elem.innerText)
      );

      // Perform the scroll
      if (element) {
        element.scrollIntoView();
        setScrolled(1);
      }
    }
  }, [scrollToc, tocScrollData.chaptersInUse, tocScrollData.tocDivs]);

  // Cleanup after scrolling
  useEffect(() => {
    if (scrolled && scrollToc) {
      setScrollToc(0);
      setScrolled(0);
    }
  }, [scrollToc, scrolled, setScrollToc]);

  return null;
};

export default memo(TocScroll);
