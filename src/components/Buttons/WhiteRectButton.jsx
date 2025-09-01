import {Link} from 'react-router-dom';

export default function WhiteRectButton({text, href}) {
  return(
      <Link
        to={href}
        className="inline-block bg-white text-black text-center px-6 py-4 hover:bg-gray-500 rounded-md"
      >
        {text}
      </Link>
  );
}
