import { LOG_LEVEL } from "./consts.js";

const DEFAULT_LOGS = [
    {
        id: "abc123",
        date: '2024-10-20T12:01:00.000Z',
        text: "Ceci est un message d'information beaucoup plus long qui prend plus de place! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        level: LOG_LEVEL.INFO,
        session : "fd46-5380ef55-b471"
    },
    {
        id: "def456",
        date: '2024-10-20T12:01:25.000Z',
        text: "Ceci est un message d'avertissement avec plus de place",
        level: LOG_LEVEL.WARN,
        session : "fd46-5380ef55-b471"
    },
    {
        id: "ghi789",
        date: '2024-10-20T12:02:03.000Z',
        text: "Ceci est un message d'erreur!!",
        level: LOG_LEVEL.ERROR,
        session : "cd51-44af754d-5821"
    },
    {
        id: "jkl012",
        date: '2024-10-20T12:02:12.000Z',
        text: "Ceci est un message de debug",
        level: LOG_LEVEL.DEBUG,
        session : "cd51-44af754d-5821"
    }
];

export default DEFAULT_LOGS;