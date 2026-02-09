<?php

namespace App\Form;

use App\Form\Type\ColorPickerType;
use App\Form\Type\DatePickerType;
use App\Form\Type\DateRangeType;
use App\Form\Type\DropzoneType;
use App\Form\Type\EnhancedChoiceType;
use App\Form\Type\TagsType;
use App\Form\Type\WysiwygType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class DemoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Item name',
                'constraints' => [
                    new NotBlank(message: 'The name is required.'),
                    new Length(min: 3, minMessage: 'The name must be at least {{ limit }} characters long.'),
                ],
                'help' => 'The name must be at least 3 characters long.',
            ])
            ->add('email', EmailType::class, [
                'label' => 'Contact email',
                'constraints' => [
                    new NotBlank(message: 'The email is required.'),
                    new Email(message: 'The email is not valid.'),
                ],
            ])
            ->add('password', PasswordType::class, [
                'label' => 'Password',
                'required' => false,
                'help' => 'Leave blank to keep unchanged.',
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Short description',
                'required' => false,
                'attr' => ['rows' => 3],
            ])
            ->add('richDescription', WysiwygType::class, [
                'label' => 'Rich description',
                'required' => false,
            ])
            ->add('category', ChoiceType::class, [
                'label' => 'Category',
                'choices' => [
                    'Blog' => 'blog',
                    'Marketing' => 'marketing',
                    'Email' => 'email',
                    'Documentation' => 'documentation',
                    'Communication' => 'communication',
                ],
                'placeholder' => 'Select a category',
                'constraints' => [
                    new NotBlank(message: 'Please select a category.'),
                ],
            ])
            ->add('enhancedCategory', EnhancedChoiceType::class, [
                'label' => 'Category tags (Tom Select)',
                'choices' => [
                    'PHP' => 'php',
                    'Symfony' => 'symfony',
                    'JavaScript' => 'javascript',
                    'Tailwind CSS' => 'tailwind',
                    'Docker' => 'docker',
                    'PostgreSQL' => 'postgresql',
                    'Redis' => 'redis',
                    'Elasticsearch' => 'elasticsearch',
                ],
                'multiple' => true,
                'required' => false,
                'placeholder' => 'Search and select...',
            ])
            ->add('tags', TagsType::class, [
                'label' => 'Keywords',
                'required' => false,
                'help' => 'Enter tags separated by commas.',
            ])
            ->add('publishedAt', DatePickerType::class, [
                'label' => 'Publication date',
                'required' => false,
            ])
            ->add('validityPeriod', DateRangeType::class, [
                'label' => 'Validity period',
                'required' => false,
            ])
            ->add('color', ColorPickerType::class, [
                'label' => 'Associated color',
                'required' => false,
            ])
            ->add('active', CheckboxType::class, [
                'label' => 'Active',
                'required' => false,
            ])
            ->add('priority', ChoiceType::class, [
                'label' => 'Priority',
                'choices' => [
                    'Low' => 'low',
                    'Medium' => 'medium',
                    'High' => 'high',
                ],
                'expanded' => true,
            ])
            ->add('quantity', NumberType::class, [
                'label' => 'Quantity',
                'required' => false,
                'constraints' => [
                    new GreaterThanOrEqual(value: 0, message: 'The quantity must be positive.'),
                ],
            ])
            ->add('image', DropzoneType::class, [
                'label' => 'Main image',
                'required' => false,
                'max_file_size' => 5,
                'accepted_types' => 'image/*',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([]);
    }
}
