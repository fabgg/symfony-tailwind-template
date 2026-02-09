<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EnhancedChoiceType extends AbstractType
{
    public function getParent(): string
    {
        return ChoiceType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'searchable' => true,
            'placeholder' => 'Select...',
        ]);

        $resolver->setAllowedTypes('searchable', 'bool');
    }

    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        $view->vars['searchable'] = $options['searchable'];
        $view->vars['placeholder'] = $options['placeholder'];
    }

    public function getBlockPrefix(): string
    {
        return 'enhanced_choice';
    }
}
