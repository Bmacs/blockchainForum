import * as wagmi from 'wagmi';
import { useProvider, useSigner } from 'wagmi';
import type { BigNumber } from 'ethers';

// import ContractABI
import CommentsContract from '../artifacts/contracts/Comments.sol/Comments.json'

export interface Comment { 
    id: string;
    topic: string;
    message: string;
    creator_address: string;
    created_at: BigNumber;
}

export enum EventType {
    CommentAdded = "CommentAdded"
}

const useCommentsContract = () => {
    const [signer] = useSigner();

    const provider = useProvider();

    // This returns a new ethers.Contract ready to interact with our comments API.
    // We need to pass in the address of our deployed contract as well as its abi.
    // We also pass in the signer if there is a signed in wallet, or if there's
    // no signed in wallet then we'll pass in the connected provider.
    const contract = wagmi.useContract({
        addressOrName: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
        contractInterface: CommentsContract.abi,
        signerOrProvider: signer.data || provider
    });

    const getComments = async (topic: string): Promise<Comment[]> => {
        return contract.getComments(topic).then((comments) => {
            // Each comment is represented as array by default so we convert to object
            return comments.map((c) => ({ ...c }))
        })
    };

    const addComment = async (topic: string, message: string): Promise<void> => {
        const tx = await contract.addComment(topic, message)
        await tx.wait()
    }

    return {
        contract,
        chainId: contract.provider.network?.chainId,
        getComments,
        addComment,
    }
}

export default useCommentsContract;