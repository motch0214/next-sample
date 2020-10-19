import useSWR, { ConfigInterface, responseInterface } from "swr"

import { Api, ErrorHandling, useApi } from "components/ApiContext"

const fetcher = (api: Api, path: string) => api.get(path).then((r) => r.json())

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useQuery<DATA = any>(
  path: string | null,
  config?: ConfigInterface<DATA, ErrorHandling>
): responseInterface<DATA, ErrorHandling> {
  const api = useApi()
  return useSWR(path ? [api, path] : null, fetcher, config)
}

export default useQuery
