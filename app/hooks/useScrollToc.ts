import { MutableRefObject } from "react";

interface Props {
  scrollToc: number;
  tocRefs: MutableRefObject<HTMLDivElement[]>;
}

const useScrollToc = (props: Props): number => {
  const { scrollToc, tocRefs } = props;

  // Jumps to chapterNumber 1 less, so don't jump to ~ 100, 200... as there is no 99, 199...
  if (scrollToc % 100 !== 0) {
    const re = new RegExp(`(${scrollToc - 1})`);
    const element = tocRefs.current.find((elem) => re.test(elem.innerText));
    element.scrollIntoView();
  }
  // Return "true" as scroll request evaluated
  return 1;
};

export default useScrollToc;
