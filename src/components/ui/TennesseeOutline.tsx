interface TennesseeOutlineProps {
  className?: string;
}

/** Bare state silhouette — image fill comes later. */
export default function TennesseeOutline({ className = '' }: TennesseeOutlineProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1300 309"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M1299 3 L1295 0 L1164 5 L1103 5 L916 11 L629 17 L448 24 L335 24 L329 30 L328 48 L321 55 L218 54 L98 50 L95 52 L93 56 L89 81 L82 104 L46 189 L40 211 L30 225 L20 231 L11 233 L4 238 L4 243 L9 255 L9 272 L0 302 L2 305 L7 307 L400 308 L670 303 L841 298 L896 295 L906 289 L909 282 L911 264 L915 257 L929 246 L953 240 L957 234 L960 219 L966 210 L1001 192 L1039 180 L1050 174 L1070 159 L1084 152 L1111 143 L1114 141 L1119 133 L1120 124 L1123 118 L1146 98 L1164 86 L1174 85 L1183 94 L1191 95 L1196 92 L1205 79 L1221 68 L1230 66 L1252 66 L1264 48 L1293 23 L1299 12 Z"
      />
    </svg>
  );
}
