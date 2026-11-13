/* Domino in Arabic: the shared Kalio base, the words kept from Bakini and Domino's own, one chunk. */
import base from "./base/ar";
import bakini from "./bakini.ar";
import own from "./domino.ar";

export default { ...base, ...bakini, ...own } as Record<string, string>;
