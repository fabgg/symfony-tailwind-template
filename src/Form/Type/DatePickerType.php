<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Date field with a flatpickr calendar.
 *
 * The submitted value stays ISO (yyyy-MM-dd / Y-m-d). The displayed value follows the user locale
 * (e.g. 31/12/2026 in French) through flatpickr "altInput". Override with 'display_format'.
 */
class DatePickerType extends AbstractType
{
    /** Display formats (flatpickr tokens) per language; languages not listed display ISO. */
    private const DISPLAY_FORMATS = [
        'fr' => 'd/m/Y',
        'de' => 'd.m.Y',
        'es' => 'd/m/Y',
        'it' => 'd/m/Y',
        'en' => 'Y-m-d',
    ];

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
            // Locale::getDefault() is set per request by Symfony's LocaleListener.
            'locale' => static fn (Options $options): string => substr(\Locale::getDefault(), 0, 2),
            'display_format' => static fn (Options $options): ?string => self::DISPLAY_FORMATS[$options['locale']] ?? null,
        ]);

        $resolver->setAllowedTypes('flatpickr_format', 'string');
        $resolver->setAllowedTypes('enable_time', 'bool');
        $resolver->setAllowedTypes('locale', 'string');
        $resolver->setAllowedTypes('display_format', ['null', 'string']);
    }

    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        $view->vars['format'] = $options['flatpickr_format'];
        $view->vars['enable_time'] = $options['enable_time'];
        $view->vars['locale'] = $options['locale'];
        // No alternate input when the display format equals the submitted format.
        $view->vars['display_format'] = $options['display_format'] !== $options['flatpickr_format'] ? $options['display_format'] : null;
    }

    public function getBlockPrefix(): string
    {
        return 'date_picker';
    }
}
