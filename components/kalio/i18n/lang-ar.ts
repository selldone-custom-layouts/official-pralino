/* Pralino in Arabic: the shared Kalio base, the words kept from Bakini and Pralino's own, one chunk. */
import base from "./base/ar";
import bakini from "./bakini.ar";
import own from "./pralino.ar";

export default { ...base, ...bakini, ...own } as Record<string, string>;
