import { VMContext } from "near-mock-vm";
import { Context } from "near-sdk-core";
import { Popularity } from "../assembly";

let contest: Popularity;

describe("contest init", () => {
    beforeEach(() => {
        contest = new Popularity("senpai.near");
    })

    it("checking default parameters", () => {
        expect(contest.owner).toBe("senpai.near", "contract owner should be senpai.near")
    })
})

describe("Adding contestants", () => {
    beforeEach(() => {
        contest = new Popularity("senpai.near");
        VMContext.setPredecessor_account_id("senpai.near");
    })

    it("only owner can add contestants", () => {
        VMContext.setPredecessor_account_id("0x.nik.near");
        expect(() => {
            contest.addContestants("test.near", "test1.near", 100)
        })
            .toThrow("only owner can call the function");
    })

    it("checking variables after contest started", () => {

        contest.addContestants("test.near", "test1.near", 10);
        expect(contest.stopContestTime).toBe(Context.blockTimestamp + 10 * 60 * 1000, "block stamp should be 60042")
    })

    it("contest started can't set contestants", () => {

        contest.addContestants("test.near", "test1.near", 10);
        expect(() => {
            contest.addContestants("test.near", "test1.near", 10);
        }).toThrow("Contest is in progress")
    })
})