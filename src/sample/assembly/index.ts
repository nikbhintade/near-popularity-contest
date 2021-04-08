import { Context, logging, PersistentMap } from "near-sdk-as";
// --- contract code goes below
@nearBindgen
export class Popularity {
    public owner: string;
    public C1: string;
    public C2: string;
    public votesForC1: u8;
    public votesForC2: u8;
    public stopContestTime: u64 = 1;

    constructor(owner: string) {
        this.owner = owner;
        logging.log("Owner is: " + this.owner)
    }

    addContestants(C1: string, C2: string, stopContestTime: u64): void {
        this.onlyOwner();
        // this.contestStarted();
        if (this.stopContestTime === 1) {
            this.C1 = C1;
            this.C2 = C2;
            this.stopContestTime = Context.blockTimestamp + (stopContestTime * 1000 * 60);
        } else {
            throw new Error("Contest is in progress")
        }
        log(this.stopContestTime)
    }

    // getWinner(): string {
    //     this.contestStatus();
    //     this.stopContestTime = 1;
    //     let winner: string;
    //     if (this.votesForC1 > this.votesForC2) {
    //         return "winner is " + this.C1;
    //     }
    //     return "winner is " + this.C2;
    // }

    // private contestStatus(): void {
    //     assert(this.stopContestTime > Context.blockTimestamp, "Contest is in progress")
    //     assert(this.stopContestTime === 1, "Contest not started yet");
    // }
    // private contestStarted(): void {
    //     // issue in this assert statement
    //     // how to check if 
    //     assert(this.stopContestTime > 2, "Contest is in progress")
    // }
    private onlyOwner(): void {
        const caller = Context.predecessor;
        assert(this.owner == caller, "only owner can call the function");
    }
}