//
// Copyright © 2023 Hardcore Engineering Inc.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

import { Asset, IntlString } from '@hcengineering/platform'
import { Attribute, Doc, Domain, Ref } from './classes'
import { WithLookup } from './storage'
import { IdMap, toIdMap } from './utils'

/**
 * @public
 */
export interface StatusCategory extends Doc {
  ofAttribute: Ref<Attribute<Status>>
  icon: Asset
  label: IntlString
  color: number
  defaultStatusName?: string
  order: number // category order
}
/**
 * @public
 */
export const DOMAIN_STATUS = 'status' as Domain

/**
 * @public
 *
 * Status is attached to attribute, and if user attribute will be removed, all status values will be remove as well.
 */
export interface Status extends Doc {
  // We attach to attribute, so we could distinguish between
  ofAttribute: Ref<Attribute<Status>>

  // Optional category.
  category?: Ref<StatusCategory>

  // Status with case insensitivity name match will be assumed same.
  name: string

  // Optional color
  color?: number
  // Optional description
  description?: string
  // Lexorank rank for ordering.
  rank: string
}

/**
 * @public
 */
export class StatusValue {
  constructor (readonly name: string, readonly color: number | undefined, readonly values: WithLookup<Status>[]) {}
}

/**
 * @public
 *
 * Allow to query for status keys/values.
 */
export class StatusManager {
  byId: IdMap<WithLookup<Status>>

  constructor (readonly statuses: WithLookup<Status>[]) {
    this.byId = toIdMap(statuses)
  }

  get (ref: Ref<Status>): WithLookup<Status> | undefined {
    return this.byId.get(ref)
  }

  filter (predicate: (value: WithLookup<Status>) => boolean): WithLookup<Status>[] {
    return this.statuses.filter(predicate)
  }
}

/**
 * @public
 */
export type CategoryType = number | string | undefined | Ref<Doc> | StatusValue