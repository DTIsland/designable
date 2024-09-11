import React from 'react'
import { Rating as NextRating } from '@alifd/next'
import { createBehavior, createResource } from '@didesignable/core'
import { DnComponent } from '@didesignable/react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Rating: DnComponent<React.ComponentProps<typeof NextRating>> =
  NextRating

Rating.Behavior = createBehavior({
  name: 'Rating',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Rating',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Rating),
  },
  designerLocales: AllLocales.Rating,
})

Rating.Resource = createResource({
  icon: 'RateSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'number',
        title: 'Rating',
        'x-decorator': 'FormItem',
        'x-component': 'Rating',
      },
    },
  ],
})
