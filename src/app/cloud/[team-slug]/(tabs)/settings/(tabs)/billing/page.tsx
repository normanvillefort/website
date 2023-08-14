import React from 'react'
import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam'
import { CreditCardListWithElements } from '@cloud/_components/CreditCardList'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import { Text } from '@forms/fields/Text'
import { Metadata } from 'next'

import HR from '@components/MDX/components/HR'
import { checkTeamRoles } from '@root/utilities/check-team-roles'

import classes from './page.module.scss'

export default async function TeamBillingWrapper({ params: { 'team-slug': teamSlug } }) {
  const { user } = await fetchMe()
  const team = await fetchTeamWithCustomer(teamSlug)

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  return (
    <React.Fragment>
      <SectionHeader
        title="Billing"
        intro={
          <React.Fragment>
            {!hasCustomerID && (
              <p className={classes.error}>
                This team does not have a billing account. Please contact support to resolve this
                issue.
              </p>
            )}
          </React.Fragment>
        }
      />
      {hasCustomerID && (
        <React.Fragment>
          {!isCurrentTeamOwner && (
            <p className={classes.error}>You must be an owner of this team to manage billing.</p>
          )}
          {isCurrentTeamOwner && (
            <React.Fragment>
              <h6>Payment Methods</h6>
              <p>
                The following payment methods are available for this team. Projects that do not
                specify a payment method will use the default payment method set for this team.
              </p>
              <CreditCardListWithElements team={team} />
            </React.Fragment>
          )}
          <HR />
          <div className={classes.fields}>
            <Text
              value={team?.stripeCustomerID}
              label="Customer ID"
              disabled
              description="This value was automatically generated when this team was created."
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Billing`,
    openGraph: {
      title: `${teamSlug} - Team Billing`,
      url: `/cloud/${teamSlug}/settings/billing`,
    },
  }
}
