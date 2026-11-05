# Open questions for the project lead

Raised during the November 2026 quality pass (every game, simulation, lab, lesson and tool was played through in
English and Bahasa Melayu, for each audience, on desktop and phone). Nothing below was changed without a clear
error; these are the points that need a decision from the WasteQuest team. Tick them off or reply inline.

## Safety (hands-on labs)

1. **Soap (lye / NaOH).** The steps now say the lye stage is a trained-teacher demonstration, with the NaOH kept
   locked and labelled. Our advice is that no student, teens included, handles lye. Is "teacher demo only"
   acceptable to the schools?
2. **Soap lye amount.** The recipe uses a saponification value of 0.138 for palm olein. Many tables give about
   0.141, which would mean a little more superfat (the safer direction). Used oil varies, so please confirm the
   figure with a lye calculator.
3. **Bokashi.** Kids may handle bokashi that contains meat or fish. Should kids' steps exclude meat and fish?
4. **Odour absorber shapes.** Corn-syrup shapes left in humid rooms can grow mould and attract ants. Keep, or swap
   for an unsweetened recipe?
5. **Pet food: taurine.** 11 g per batch looks high. The step is already optional and marked "vet only", but the
   amount should be checked.

## Science and figures

6. **Food share of household waste.** The app uses 30.6% (SWCorp via The Star, 2 Jan 2024) in the eco-enzyme sim
   and the footprint calculator. Other SWCorp figures often quote about 44%. Keep 30.6%?
7. **Methane.** Question n02 says 28 times CO₂ (IPCC AR5); the myth game says 27–30 (AR6). Pick one.
8. **Waste composition figures not in the listed source:** hazardous waste 4.2% (m14), rubber 1.1% (m10),
   metal 2.4% (m04). Please give a source or we will soften the wording.
9. **Eco-enzyme yield.** In the simulation, 1.5 kg of peels gives 5 × 500 mL bottles; the 1:3:10 recipe would give
   about 10. The game is conservative on purpose. Change it?
10. **Eco-enzyme dilution.** 1:100 for cleaning and 1:500–1:1000 for plants come from community guides. Happy to
    keep these?
11. **Red cabbage indicator.** The science panel says it goes almost colourless at pH 4–5; the simulation colours
    do not. Which should we follow?
12. **Compost temperature.** A small, cool pile (5 pails, peak ~35 °C) can still be rated "good"; only adults see
    the 55 °C pathogen warning. Should kids see it too?
13. **Market game prices.** Compost is now RM 5 per 1 kg bag (it was a 3 kg bag, but 4 kg of scraps cannot make
    6 kg of compost). Is RM 5 a fair price?
14. **Act 672 list.** Should Labuan be listed with the states and KL / Putrajaya?

## Question bank

15. **Near-duplicates** that can appear in the same quiz: s03 and m15 (glass goes in the brown bin), n07 and x25
    (refilling a water bottle), c09 and c10 (jam jar as a pencil holder: "reuse" for kids, "repurpose" for teens).
16. **g08** links a school compost garden to SDG 15 only; SDG 12 or 2 could be argued.
17. **k12 and k13**: kids' answer "earthworms" for vermicomposting, while k13 says composting worms (red wigglers).

## Live class and event mode

18. **Event Town scoring (changed, please confirm).** Each round a team now earns up to 100 points, based on the
    share of its players who answered correctly. Before, it was 10 points per correct player, so the biggest team
    usually won.
19. **Kicked students** are blocked only in that browser tab; they can rejoin from a new tab. Block harder?
20. **Class size.** A live class now accepts up to 120 players on the free PeerJS connection service. Is that limit
    right?

## Privacy and research data

21. **Opt-in consent (changed).** Research records are now sent only after the player chooses OK on the privacy
    notice. Before, ignoring the notice counted as agreement. This means fewer records. Is that acceptable for the
    pilot?
22. **Visit counter.** GoatCounter (no cookies, no names) now stops when the player chooses "Don't track me".
    Should it also wait for OK?
23. **What is logged.** Mission logs include the player's own tally numbers, and every game answer is logged with
    the coded player id. Is that within the approved ethics protocol?
24. **Nicknames over PeerJS.** Class Battle and Event Town nicknames pass through PeerJS's public server. Is that
    cleared for under-18s?

## Media

25. **Captions.** None of the 30 narrated lab videos has captions. If the narration scripts exist, they can be
    turned into `assets/videos/v2/<lab>_<en|bm>.vtt` files; list the lab ids in `CAP` in `js/labs.js` and the
    player shows them automatically.
26. **eBook PDFs.** The facilitator booklets were reprinted with the new safety labels and warnings
    (`tools/print_booklets.mjs`), but `dist/WasteQuest_eBook_EN.pdf` / `_BM.pdf` were made another way and still
    show the old lab text. Please reprint them the same way as before, or tell us how they were made.
27. **Offline zip link.** The share page links to
    `github.com/wastequest/wastequest.github.io/releases/download/v2026.1/WasteQuest_offline_pack.zip`, which we
    could not check from here. Please confirm the release exists and includes the current offline copy.
