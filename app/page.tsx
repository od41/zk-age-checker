"use client"
import { useState } from "react";
// @ts-expect-error doesn't export types
import * as snarkjs from 'snarkjs'

export default function Home() {
  const [age, setAge] = useState(0);
  const [proof, setProof] = useState<string>();
  const [isProofValid, setIsProofValid] = useState<string>();

  const AGE_LIMIT = 18;

  async function handleCalculateProof() {
    if (age==0) {
      window.alert("Invalid age, please try again.")
      return
    }
    const { proof, publicSignals } =
      await snarkjs.groth16.fullProve( { age: age, ageLimit: AGE_LIMIT}, "age_checker.wasm", "age_checker_final.zkey");

    const proofComponent = JSON.stringify(proof, null, 1);
    
    const calldata = await snarkjs.groth16.exportSolidityCallData(
      proof, publicSignals
      );
      
      console.log('publicSignals', publicSignals)
      setProof(calldata)


    const vkey = await fetch("verification_key.json").then( function(res) {
        return res.json();
    });

    await snarkjs.groth16.verify(vkey, ['1', '18'], proof).then((res: any) => {

      setIsProofValid(res)
      console.log(typeof(res), res)
    });

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          zk Application: Check your age in a privacy preserving application
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://odafe41.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            By Odafe
          </a>
        </div>
      </div>

      <div>
        <input 
          placeholder="Enter your age"
          type="number" 
          className="rounded-md w-full items-center my-5 text-center justify-center border-b border-gray-300 bg-gray-300 pb-3 py-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/80 dark:from-inherit"
          onChange={(e)=>{setAge(Number(e.target.value))}}
        />
        <button onClick={handleCalculateProof} className="bg-white text-black flex items-center justify-center rounded-md py-3 w-full">
          Create Proof
        </button>

        {proof  && <p className="py-3 flex flex-wrap w-full text-balance max-w-[1080px] justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Proof: {proof}
        </p> }

       {isProofValid != undefined && <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          is Valid?: {String(isProofValid)}
        </p>}
      </div>
    </main>
  );
}
