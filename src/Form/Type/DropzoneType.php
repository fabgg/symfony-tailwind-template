<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DropzoneType extends AbstractType
{
    public function getParent(): string
    {
        return FileType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'max_file_size' => 5,
            'accepted_types' => '',
        ]);

        $resolver->setAllowedTypes('max_file_size', ['int', 'float']);
        $resolver->setAllowedTypes('accepted_types', 'string');
    }

    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        $view->vars['max_file_size'] = $options['max_file_size'];
        $view->vars['accepted_types'] = $options['accepted_types'];
    }

    public function getBlockPrefix(): string
    {
        return 'dropzone';
    }
}
