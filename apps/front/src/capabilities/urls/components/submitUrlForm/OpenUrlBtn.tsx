import { FiExternalLink } from "react-icons/fi";

type OpenUrlBtnProps = {
  url: string;
};

export const OpenUrlBtn = ({ url }: OpenUrlBtnProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-500 hover:text-gray-700 focus:outline-none"
    aria-label="Open URL in new window"
  >
    <FiExternalLink size={20} />
  </a>
);

export default OpenUrlBtn;
