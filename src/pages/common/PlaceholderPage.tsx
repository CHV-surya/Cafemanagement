import React from 'react'
import { PageHeader, EmptyState, Button, Badge } from '@/components/common'
import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'

export interface PlaceholderPageProps {
  moduleName: string
  description?: string
  backLink?: string
  backLabel?: string
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  moduleName,
  description = 'This workspace module is currently staged for implementation in the next phase.',
  backLink = '/admin/dashboard',
  backLabel = 'Back to Dashboard',
}) => {
  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title={moduleName}
        subtitle="Operational module preview and foundation architecture."
        breadcrumbs={[
          { label: 'Workspace', href: backLink },
          { label: moduleName },
        ]}
        actions={
          <Badge variant="gold" size="md">
            Upcoming Phase
          </Badge>
        }
      />

      <div className="rounded-2xl bg-cream-card p-12 border border-cream-border shadow-subtle text-center">
        <EmptyState
          icon={Construction}
          title={`${moduleName} Module Under Construction`}
          description={description}
          action={
            <Link to={backLink}>
              <Button variant="secondary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                {backLabel}
              </Button>
            </Link>
          }
        />
      </div>
    </div>
  )
}
