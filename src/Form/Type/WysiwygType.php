<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class WysiwygType extends AbstractType
{
    public function getParent(): string
    {
        return TextareaType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'attr' => ['style' => 'display:none'],
        ]);
    }

    public function getBlockPrefix(): string
    {
        return 'wysiwyg';
    }
}
