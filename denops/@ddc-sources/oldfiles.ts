/*
 * Copyright (c) 2021 TANIGUCHI Masaya. All rights reserved.
 * This work is licensed under the MIT license. git.io/mit-license
 */

import {
  BaseSource,
  Candidate,
} from "https://lib.deno.dev/x/ddc_vim@v0/types.ts";
import {
  GatherCandidatesArguments,
  GetCompletePositionArguments,
} from "https://lib.deno.dev/x/ddc_vim@v0/base/source.ts";
import * as vars from "https://deno.land/x/denops_std@v2.1.1/variable/mod.ts";

type UserData = Record<string, never>;
type Params = Record<string, never>;

function isValidUnixPath(path: string): boolean {
  let escape = false;
  for (let i = 0; i < path.length; i++) {
    if (!escape && path[i].match(/\s/)) {
      return false;
    }
    if (path[i] === "\\") {
      escape = !escape;
    } else {
      escape = false;
    }
  }
  return true;
}

export class Source extends BaseSource<Params, UserData> {
  override getCompletePosition(
    arg: GetCompletePositionArguments<Params>,
  ): Promise<number> {
    for (let i = 0; i < arg.context.input.length; i++) {
      if (isValidUnixPath(arg.context.input.slice(i))) {
        return Promise.resolve(i);
      }
    }
    return Promise.resolve(arg.context.input.length);
  }
  async gatherCandidates(
    args: GatherCandidatesArguments<Params>,
  ): Promise<Candidate<UserData>[]> {
    const files = await vars.v.get(args.denops, "oldfiles", [] as string[]);
    return files.map((word) => ({ word }));
  }
  params(): Params {
    return {};
  }
}
