<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TagsType extends AbstractType
{
    public function getParent(): string
    {
        return TextType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'max_items' => null,
            'delimiter' => ',',
        ]);

        $resolver->setAllowedTypes('max_items', ['null', 'int']);
        $resolver->setAllowedTypes('delimiter', 'string');
    }

    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        $view->vars['max_items'] = $options['max_items'];
        $view->vars['delimiter'] = $options['delimiter'];
    }

    public function getBlockPrefix(): string
    {
        return 'tags';
    }
}
