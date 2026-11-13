/*
 * Bakini Noir's shared state now lives in components/domino/dm.ts (Domino's
 * shell and home use it). The Noir pages not yet ported to Domino read it
 * through these names, so there is one layer state and one catalogue.
 * Removed with the last Noir page.
 */
export * from "../../domino/dm";
export { dm as noir, loadDm as loadNoir } from "../../domino/dm";
