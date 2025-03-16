import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { Button } from "../ui/button";

export function Account() {
  const { address } = useAccount();
  const { disconnect } =
    useDisconnect();
  const { data: ensName } = useEnsName({
    address,
  });
  const { data: ensAvatar } =
    useEnsAvatar({ name: ensName! });

  return (
    <div>
      {ensAvatar && (
        <img
          alt='ENS Avatar'
          src={ensAvatar}
        />
      )}
      {address && (
        <div>
          {ensName
            ? `${ensName} (${address})`
            : address}
        </div>
      )}
      <Button
        onClick={() => disconnect()}
        variant='outline'>
        Disconnect
      </Button>
    </div>
  );
}
