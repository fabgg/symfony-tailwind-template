<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DateRangeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('start', DatePickerType::class, [
                'label' => 'Start',
                'required' => $options['required'],
            ])
            ->add('end', DatePickerType::class, [
                'label' => 'End',
                'required' => $options['required'],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'compound' => true,
        ]);
    }

    public function getBlockPrefix(): string
    {
        return 'date_range';
    }
}
