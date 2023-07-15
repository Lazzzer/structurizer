import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-screen h-screen grid place-items-center place-content-center text-slate-800">
      <svg
        width="376"
        height="103"
        viewBox="0 0 376 103"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M111.352 97.704H103.24V96.624L111.856 85.2H114.712V95.016H116.632V97.704H114.712V102H111.352V97.704ZM111.376 95.016V92.76C111.376 91.48 111.408 90.544 111.472 89.952C111.232 90.368 110.896 90.872 110.464 91.464L107.728 95.016H111.376ZM124.126 102.312C122.862 102.312 121.734 102.024 120.742 101.448C119.75 100.856 118.974 100.064 118.414 99.072C117.87 98.08 117.598 96.984 117.598 95.784V91.464C117.598 90.264 117.87 89.168 118.414 88.176C118.974 87.184 119.75 86.4 120.742 85.824C121.734 85.232 122.862 84.936 124.126 84.936C125.39 84.936 126.518 85.232 127.51 85.824C128.502 86.4 129.27 87.184 129.814 88.176C130.374 89.168 130.654 90.264 130.654 91.464V95.784C130.654 96.984 130.374 98.08 129.814 99.072C129.27 100.064 128.502 100.856 127.51 101.448C126.518 102.024 125.39 102.312 124.126 102.312ZM121.078 95.4C121.078 96.536 121.334 97.456 121.846 98.16C122.374 98.848 123.134 99.192 124.126 99.192C125.118 99.192 125.87 98.848 126.382 98.16C126.91 97.456 127.174 96.536 127.174 95.4V91.872C127.174 90.64 126.918 89.696 126.406 89.04C125.91 88.384 125.15 88.056 124.126 88.056C123.102 88.056 122.334 88.384 121.822 89.04C121.326 89.696 121.078 90.64 121.078 91.872V95.4ZM139.383 97.704H131.271V96.624L139.887 85.2H142.743V95.016H144.663V97.704H142.743V102H139.383V97.704ZM139.407 95.016V92.76C139.407 91.48 139.439 90.544 139.503 89.952C139.263 90.368 138.927 90.872 138.495 91.464L135.759 95.016H139.407ZM149.207 93.816H156.071V96.96H149.207V93.816ZM161.692 85.2H164.236L172.42 94.92C172.884 95.448 173.252 95.912 173.524 96.312C173.444 95.704 173.404 94.792 173.404 93.576V85.2H176.476V102H174.292L165.796 91.896C165.332 91.368 164.964 90.904 164.692 90.504C164.772 91.096 164.812 92.008 164.812 93.24V102H161.692V85.2ZM184.8 102.312C183.536 102.312 182.4 102.024 181.392 101.448C180.384 100.856 179.592 100.064 179.016 99.072C178.44 98.064 178.152 96.968 178.152 95.784C178.152 94.6 178.44 93.504 179.016 92.496C179.592 91.488 180.384 90.696 181.392 90.12C182.4 89.528 183.536 89.232 184.8 89.232C186.064 89.232 187.2 89.528 188.208 90.12C189.216 90.696 190.008 91.488 190.584 92.496C191.16 93.504 191.448 94.6 191.448 95.784C191.448 96.968 191.16 98.064 190.584 99.072C190.008 100.064 189.216 100.856 188.208 101.448C187.2 102.024 186.064 102.312 184.8 102.312ZM181.392 95.784C181.392 96.44 181.528 97.04 181.8 97.584C182.088 98.128 182.488 98.56 183 98.88C183.528 99.2 184.128 99.36 184.8 99.36C185.472 99.36 186.064 99.2 186.576 98.88C187.104 98.56 187.504 98.128 187.776 97.584C188.064 97.04 188.208 96.44 188.208 95.784C188.208 95.128 188.064 94.528 187.776 93.984C187.488 93.44 187.088 93.008 186.576 92.688C186.064 92.352 185.472 92.184 184.8 92.184C184.128 92.184 183.536 92.352 183.024 92.688C182.512 93.008 182.112 93.44 181.824 93.984C181.536 94.528 181.392 95.128 181.392 95.784ZM196.93 102C195.666 102 194.714 101.688 194.074 101.064C193.434 100.44 193.114 99.464 193.114 98.136V92.28H191.362V89.52H193.114V87L196.354 86.664V89.52H198.994V92.28H196.354V97.968C196.354 98.736 196.69 99.12 197.362 99.12H198.706V102H196.93ZM204.255 85.2H214.119V88.224H207.615V92.16H213.999V95.136H207.615V102H204.255V85.2ZM222.089 102.312C220.825 102.312 219.689 102.024 218.681 101.448C217.673 100.856 216.881 100.064 216.305 99.072C215.729 98.064 215.441 96.968 215.441 95.784C215.441 94.6 215.729 93.504 216.305 92.496C216.881 91.488 217.673 90.696 218.681 90.12C219.689 89.528 220.825 89.232 222.089 89.232C223.353 89.232 224.489 89.528 225.497 90.12C226.505 90.696 227.297 91.488 227.873 92.496C228.449 93.504 228.737 94.6 228.737 95.784C228.737 96.968 228.449 98.064 227.873 99.072C227.297 100.064 226.505 100.856 225.497 101.448C224.489 102.024 223.353 102.312 222.089 102.312ZM218.681 95.784C218.681 96.44 218.817 97.04 219.089 97.584C219.377 98.128 219.777 98.56 220.289 98.88C220.817 99.2 221.417 99.36 222.089 99.36C222.761 99.36 223.353 99.2 223.865 98.88C224.393 98.56 224.793 98.128 225.065 97.584C225.353 97.04 225.497 96.44 225.497 95.784C225.497 95.128 225.353 94.528 225.065 93.984C224.777 93.44 224.377 93.008 223.865 92.688C223.353 92.352 222.761 92.184 222.089 92.184C221.417 92.184 220.825 92.352 220.313 92.688C219.801 93.008 219.401 93.44 219.113 93.984C218.825 94.528 218.681 95.128 218.681 95.784ZM234.803 102.288C233.907 102.288 233.099 102.08 232.379 101.664C231.659 101.232 231.091 100.632 230.675 99.864C230.259 99.08 230.051 98.176 230.051 97.152V89.52H233.291V96.36C233.291 98.424 234.123 99.456 235.787 99.456C236.523 99.456 237.139 99.2 237.635 98.688C238.131 98.16 238.379 97.384 238.379 96.36V89.52H241.619V102H238.475V100.128C238.171 100.864 237.723 101.408 237.131 101.76C236.539 102.112 235.763 102.288 234.803 102.288ZM243.53 89.52H246.722V91.344C247.378 89.936 248.65 89.232 250.538 89.232C251.434 89.232 252.242 89.448 252.962 89.88C253.682 90.296 254.25 90.896 254.666 91.68C255.082 92.448 255.29 93.344 255.29 94.368V102H252.05V95.16C252.05 94.12 251.81 93.344 251.33 92.832C250.85 92.32 250.194 92.064 249.362 92.064C248.626 92.064 248.01 92.328 247.514 92.856C247.018 93.368 246.77 94.136 246.77 95.16V102H243.53V89.52ZM262.789 102.312C261.669 102.312 260.637 102.024 259.693 101.448C258.749 100.856 257.997 100.064 257.437 99.072C256.893 98.08 256.621 96.992 256.621 95.808C256.621 94.624 256.893 93.536 257.437 92.544C257.997 91.536 258.749 90.736 259.693 90.144C260.637 89.552 261.669 89.256 262.789 89.256C263.813 89.256 264.637 89.448 265.261 89.832C265.885 90.2 266.373 90.736 266.725 91.44V84.48H269.965V102H266.821V99.96C266.453 100.712 265.949 101.296 265.309 101.712C264.685 102.112 263.845 102.312 262.789 102.312ZM259.861 95.784C259.861 96.424 260.005 97.024 260.293 97.584C260.597 98.128 261.005 98.568 261.517 98.904C262.045 99.224 262.645 99.384 263.317 99.384C264.005 99.384 264.613 99.224 265.141 98.904C265.685 98.584 266.101 98.152 266.389 97.608C266.677 97.064 266.821 96.464 266.821 95.808C266.821 95.152 266.677 94.552 266.389 94.008C266.101 93.448 265.685 93.008 265.141 92.688C264.613 92.352 264.005 92.184 263.317 92.184C262.645 92.184 262.045 92.352 261.517 92.688C260.989 93.008 260.581 93.44 260.293 93.984C260.005 94.528 259.861 95.128 259.861 95.784Z"
          fill="#1E293B"
        />
        <rect
          x="14.4292"
          y="28.8584"
          width="8.24528"
          height="8.24528"
          rx="4.12264"
          fill="#0F172A"
        />
        <rect
          x="22.6746"
          y="18.5518"
          width="10.3066"
          height="10.3066"
          rx="5.1533"
          fill="#0F172A"
        />
        <rect
          x="22.6746"
          y="37.1038"
          width="10.3066"
          height="10.3066"
          rx="5.1533"
          fill="#0F172A"
        />
        <rect
          x="10.3066"
          y="45.3491"
          width="10.3066"
          height="10.3066"
          rx="5.1533"
          fill="#0F172A"
        />
        <rect
          x="10.3066"
          y="10.3066"
          width="10.3066"
          height="10.3066"
          rx="5.1533"
          fill="#0F172A"
        />
        <rect
          x="35.0425"
          y="10.3066"
          width="20.6132"
          height="20.6132"
          rx="10.3066"
          fill="#0F172A"
        />
        <rect
          x="35.0425"
          y="35.0425"
          width="20.6132"
          height="20.6132"
          rx="10.3066"
          fill="#0F172A"
        />
        <path
          d="M82.8892 56.6056C79.3577 56.6056 76.1915 55.875 73.3906 54.4137C70.6304 52.9117 68.3572 50.5777 66.5712 47.4115L73.9386 42.7231C74.994 44.8339 76.3336 46.417 77.9573 47.4724C79.6215 48.4872 81.4279 48.9946 83.3763 48.9946C85.3247 48.9946 86.8672 48.5481 88.0038 47.6551C89.181 46.762 89.7696 45.5849 89.7696 44.1235C89.7696 42.784 89.3434 41.688 88.4909 40.8356C87.6385 39.9831 86.5425 39.3134 85.203 38.8263C83.904 38.2986 82.1788 37.7506 80.0275 37.1823C76.6177 36.2893 73.9589 34.8482 72.0511 32.8592C70.1839 30.8702 69.2502 28.3129 69.2502 25.1873C69.2502 22.6706 69.8794 20.4583 71.1378 18.5505C72.3961 16.6021 74.1619 15.1002 76.4351 14.0448C78.7082 12.9894 81.3264 12.4617 84.2896 12.4617C87.4964 12.4617 90.2161 13.1314 92.4487 14.471C94.7218 15.8105 96.6905 17.7792 98.3548 20.3771L91.0482 24.8829C89.9928 23.178 88.9171 21.9602 87.8212 21.2296C86.7252 20.4583 85.4059 20.0727 83.8634 20.0727C82.118 20.0727 80.6972 20.4989 79.6012 21.3513C78.5053 22.2038 77.9573 23.3404 77.9573 24.7611C77.9573 26.1818 78.5053 27.2575 79.6012 27.9882C80.6972 28.6782 82.4021 29.3886 84.7159 30.1193C87.5573 31.0123 89.8305 31.8444 91.5353 32.6157C93.2402 33.3869 94.8233 34.6859 96.2846 36.5125C97.7459 38.2986 98.4766 40.6732 98.4766 43.6364C98.4766 46.1937 97.8474 48.4669 96.5891 50.4559C95.3307 52.4043 93.5244 53.9266 91.17 55.0225C88.8157 56.0779 86.0554 56.6056 82.8892 56.6056Z"
          fill="#0F172A"
        />
        <path
          d="M113.632 55.8141C110.425 55.8141 108.01 55.0225 106.386 53.4394C104.762 51.8564 103.95 49.3802 103.95 46.0111V31.1544H99.5055V24.1522H103.95V17.7589L112.17 16.9065V24.1522H118.868V31.1544H112.17V45.5849C112.17 47.5333 113.023 48.5075 114.728 48.5075H118.137V55.8141H113.632Z"
          fill="#0F172A"
        />
        <path
          d="M121.616 24.1522H129.592V30.1801C130.16 27.8664 131.256 26.1209 132.88 24.9438C134.544 23.7666 136.716 23.2592 139.395 23.4215V31.1544H138.238C135.803 31.1544 133.793 31.9256 132.21 33.4681C130.627 34.97 129.835 37.0199 129.835 39.6178V55.8141H121.616V24.1522Z"
          fill="#0F172A"
        />
        <path
          d="M153.881 56.5447C151.608 56.5447 149.558 56.017 147.731 54.9616C145.905 53.8657 144.464 52.3435 143.408 50.395C142.353 48.406 141.825 46.1126 141.825 43.5147V24.1522H150.045V41.5054C150.045 46.7417 152.156 49.3599 156.377 49.3599C158.245 49.3599 159.808 48.7105 161.066 47.4115C162.324 46.072 162.953 44.1033 162.953 41.5054V24.1522H171.173V55.8141H163.197V51.0648C162.426 52.932 161.289 54.3122 159.787 55.2052C158.285 56.0982 156.317 56.5447 153.881 56.5447Z"
          fill="#0F172A"
        />
        <path
          d="M191.123 56.6056C188.16 56.6056 185.42 55.875 182.903 54.4137C180.427 52.9117 178.458 50.8821 176.997 48.3248C175.535 45.7675 174.805 42.987 174.805 39.9831C174.805 36.9387 175.535 34.1582 176.997 31.6415C178.458 29.0842 180.488 27.0748 183.086 25.6135C185.683 24.1116 188.586 23.3607 191.793 23.3607C194.593 23.3607 197.11 23.8884 199.343 24.9438C201.575 25.9586 203.361 27.3996 204.701 29.2668L198.368 34.4423C197.638 33.3463 196.684 32.4736 195.507 31.8241C194.33 31.1746 193.051 30.8499 191.671 30.8499C189.966 30.8499 188.464 31.2761 187.165 32.1286C185.866 32.9404 184.851 34.0364 184.121 35.4165C183.39 36.7967 183.025 38.3189 183.025 39.9831C183.025 41.6068 183.39 43.129 184.121 44.5498C184.892 45.9299 185.947 47.0462 187.287 47.8986C188.626 48.7105 190.149 49.1164 191.853 49.1164C193.355 49.1164 194.654 48.7916 195.75 48.1422C196.846 47.4927 197.841 46.5591 198.734 45.3413L204.701 50.5168C201.535 54.576 197.009 56.6056 191.123 56.6056Z"
          fill="#0F172A"
        />
        <path
          d="M219.948 55.8141C216.741 55.8141 214.326 55.0225 212.702 53.4394C211.079 51.8564 210.267 49.3802 210.267 46.0111V31.1544H205.822V24.1522H210.267V17.7589L218.487 16.9065V24.1522H225.185V31.1544H218.487V45.5849C218.487 47.5333 219.339 48.5075 221.044 48.5075H224.454V55.8141H219.948Z"
          fill="#0F172A"
        />
        <path
          d="M239.684 56.5447C237.41 56.5447 235.36 56.017 233.534 54.9616C231.707 53.8657 230.266 52.3435 229.211 50.395C228.155 48.406 227.628 46.1126 227.628 43.5147V24.1522H235.848V41.5054C235.848 46.7417 237.958 49.3599 242.18 49.3599C244.047 49.3599 245.61 48.7105 246.868 47.4115C248.127 46.072 248.756 44.1033 248.756 41.5054V24.1522H256.976V55.8141H248.999V51.0648C248.228 52.932 247.092 54.3122 245.59 55.2052C244.088 56.0982 242.119 56.5447 239.684 56.5447Z"
          fill="#0F172A"
        />
        <path
          d="M261.825 24.1522H269.801V30.1801C270.37 27.8664 271.466 26.1209 273.089 24.9438C274.754 23.7666 276.925 23.2592 279.604 23.4215V31.1544H278.447C276.012 31.1544 274.003 31.9256 272.42 33.4681C270.836 34.97 270.045 37.0199 270.045 39.6178V55.8141H261.825V24.1522Z"
          fill="#0F172A"
        />
        <path
          d="M282.339 24.1522H290.559V55.8141H282.339V24.1522ZM281.487 16.663C281.487 15.3234 281.953 14.1868 282.887 13.2532C283.861 12.3196 285.038 11.8528 286.419 11.8528C287.839 11.8528 289.016 12.3196 289.95 13.2532C290.884 14.1868 291.351 15.3234 291.351 16.663C291.351 18.0431 290.884 19.2 289.95 20.1336C289.016 21.0672 287.839 21.534 286.419 21.534C285.038 21.534 283.861 21.0672 282.887 20.1336C281.953 19.1594 281.487 18.0025 281.487 16.663Z"
          fill="#0F172A"
        />
        <path
          d="M293.837 54.9008L307.72 32.9201C308.045 32.433 308.532 31.7835 309.181 30.9717H294.507V24.1522H321.785V25.0655L307.781 47.4115C307.659 47.6145 307.273 48.1422 306.624 48.9946H321.481V55.8141H293.837V54.9008Z"
          fill="#0F172A"
        />
        <path
          d="M337.993 56.6056C334.786 56.6056 331.945 55.875 329.469 54.4137C326.993 52.9117 325.065 50.9024 323.685 48.3857C322.304 45.869 321.614 43.0884 321.614 40.044C321.614 37.0402 322.325 34.2597 323.745 31.7023C325.166 29.145 327.115 27.1154 329.591 25.6135C332.107 24.1116 334.908 23.3607 337.993 23.3607C341.078 23.3607 343.839 24.1116 346.274 25.6135C348.75 27.1154 350.658 29.145 351.998 31.7023C353.378 34.2191 354.068 36.9996 354.068 40.044C354.068 41.0588 353.987 42.0331 353.824 42.9667H330.139C330.626 44.8745 331.539 46.417 332.879 47.5942C334.259 48.7308 335.964 49.299 337.993 49.299C339.698 49.299 341.22 48.9134 342.56 48.1422C343.899 47.3303 344.955 46.2952 345.726 45.0369L352.119 49.847C350.82 51.8766 348.913 53.5206 346.396 54.779C343.879 55.9968 341.078 56.6056 337.993 56.6056ZM345.787 36.817C345.3 34.9903 344.346 33.4681 342.925 32.2503C341.504 31.0326 339.82 30.4237 337.871 30.4237C335.964 30.4237 334.299 31.0123 332.879 32.1895C331.499 33.3666 330.585 34.9091 330.139 36.817H345.787Z"
          fill="#0F172A"
        />
        <path
          d="M357.676 24.1522H365.653V30.1801C366.221 27.8664 367.317 26.1209 368.941 24.9438C370.605 23.7666 372.777 23.2592 375.456 23.4215V31.1544H374.299C371.863 31.1544 369.854 31.9256 368.271 33.4681C366.688 34.97 365.896 37.0199 365.896 39.6178V55.8141H357.676V24.1522Z"
          fill="#0F172A"
        />
      </svg>
    </div>
  );
}