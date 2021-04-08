import { context, PersistentSet, u128 } from "near-sdk-as";
// --- contract code goes below
@nearBindgen
export class Popularity {
    private owner: string;
    private C1: string;
    private C2: string;
    private votesForC1: u8;
    private votesForC2: u8;
    private stopContestTime: u64 = 1;
    private votingFee: u128 = u128.fromF32(0.001);
    private voters: PersistentSet<string>

    constructor(owner: string) {
        this.owner = owner;
    }

    addContestants(C1: string, C2: string, stopContestTime: u64): void {
        this.onlyOwner();
        if (this.stopContestTime === 1) {
            this.C1 = C1;
            this.C2 = C2;
            this.stopContestTime = context.blockTimestamp + (stopContestTime * 1000 * 60);
        } else {
            throw new Error("Contest is in progress")
        }

    }

    getWinner(): string {
        this.contestNotStarted();
        this.contestNotEnded();
        this.stopContestTime = 1;
        let winner: string;
        if (this.votesForC1 > this.votesForC2) {
            return "winner is " + this.C1;
        }
        return "winner is " + this.C2;
    }

    vote(choice: number): void {

        this.contestNotStarted();
        this.contestEnded();

        if (choice <= 0 && choice > 2) {
            throw new Error("Choice not allowed")
        }
        assert(context.attachedDeposit >= this.votingFee,
            "Voting fee not paid")
        if (choice === 1) {
            this.votesForC1 += 1;
        } else {
            this.votesForC2 += 1;
        }
    }

    getOwner(): string {
        return this.owner;
    }
    getStopContestTime(): u64 {
        return this.stopContestTime;
    }
    private contestNotStarted(): void {
        assert(this.stopContestTime.toString() === "1",
            "contest has not started yet");
        /*
        when this.stopContestTime is not string test don't pass

        TODO: find why that type those type don't match
        */
    }
    private contestNotEnded(): void {
        assert(context.blockTimestamp < this.stopContestTime,
            "contest has not ended yet");
    }
    private contestEnded(): void {
        assert(context.blockTimestamp > this.stopContestTime,
            "contest has ended yet");
    }
    private onlyOwner(): void {
        const caller = context.predecessor;
        assert(this.owner == caller, "only owner can call the function");
    }
}