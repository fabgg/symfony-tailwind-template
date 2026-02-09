<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DatePickerType extends AbstractType
{
    public function getParent(): string
    {
        return DateType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'widget' => 'single_text',
            'html5' => false,
            'format' => 'yyyy-MM-dd',
            'flatpickr_format' => 'Y-m-d',
            'enable_time' => false,
        ]);

        $resolver->setAllowedTypes('flatpickr_format', 'string');
        $resolver->setAllowedTypes('enable_time', 'bool');
    }

    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        $view->vars['format'] = $options['flatpickr_format'];
        $view->vars['enable_time'] = $options['enable_time'];
    }

    public function getBlockPrefix(): string
    {
        return 'date_picker';
    }
}
